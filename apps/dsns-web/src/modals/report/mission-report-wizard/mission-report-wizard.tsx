import { useEffect, useState, useMemo } from 'react';

import { Form, Drawer, Divider, Spin, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { MIME_TYPE } from 'shared-my';
import { fileUtils, mapUtils, useAsyncEffect } from 'shared-my-client';
import { type IGeoapifyAddress } from 'shared-my-client/api/external/external.types';

import { ExternalApi } from '~/api';
import { Icon, Select, WizardButtons, WizardFooter } from '~/components';
import { WIZARD_MODE, MODALS, MAP_VIEW_TAKE_PRINT_CONTAINER, MAP_SIZE } from '~/constants';
import { useStore, useWizard } from '~/hooks';
import { Modal, Image, Crashlytics, Template } from '~/services';

import { ExplosiveObjectAction, Timer, Transport, Equipment, Approved, Documents, Act, Territory, Employees, Map } from './components';
import { ExplosiveDeviceAction } from './components/explosive-action';
import { s } from './mission-report-wizard.styles';
import { type IMissionReportProps, type IMissionReportForm } from './mission-report-wizard.types';
import { createCopyValue, createCreateValue, createEditValue } from './mission-report-wizard.utils';

const getTitles = ({ isEdit, isCreate }: { isEdit: boolean; isCreate: boolean }) => {
    if (isCreate) return 'Створення акту виконаних робіт';
    if (isEdit) return 'Редагування акту виконаних робіт';

    return 'Акт виконаних робіт';
};

export const MissionReportWizardModal = observer(({ id, isVisible, hide, mode = WIZARD_MODE.VIEW, initialMap }: IMissionReportProps) => {
    const [isLoadingPreview, setLoadingPreview] = useState(false);
    const [isLoadingAddress, setLoadingAddress] = useState(false);
    const [initialAddressDetails, setInitialAddressDetails] = useState<IGeoapifyAddress | undefined>(undefined);
    const [templateId, setTemplateId] = useState();

    const { order, missionRequest, employee, missionReport, document } = useStore();

    const wizard = useWizard({ id, mode });

    const currentMissionReport = id ? missionReport.collection.get(id) : null;

    const onOpenDocxPreview = async () => {
        try {
            setLoadingPreview(true);

            if (!currentMissionReport) throw new Error('there is no mission report');
            if (!templateId) throw new Error('there is no selected template');

            const image = await Image.takeMapImage(`#${MAP_VIEW_TAKE_PRINT_CONTAINER}`);

            const imageData = {
                _type: 'image',
                source: fileUtils.b64toBlob(image),
                format: 'image/jpeg',
                altText: 'image',
                width: MAP_SIZE.MEDIUM_WIDTH,
                height: MAP_SIZE.MEDIUM_HEIGHT,
            };

            const docxData = {
                ...currentMissionReport.printData,
                image: imageData,
            };

            const currentDocument = document.collection.get(templateId);

            if (!currentDocument) throw new Error('there is no selected document');

            const template = await currentDocument.load.run();

            if (!template) return;

            const value = await Template.generateFile(template, docxData);

            const name = `${currentMissionReport.data?.executedAt.format('YYYY.MM.DD')} ${currentMissionReport?.printData.actNumber}`;

            const file = fileUtils.blobToFile(value, {
                name,
                type: 'docx',
            });

            Modal.show(MODALS.DOCX_PREVIEW, { file, name });
        } catch (e) {
            Crashlytics.error('MissionReportWizardModal - onOpenDocxPreview: ', e);
            message.error('Bиникла помилка');
        } finally {
            setLoadingPreview(false);
        }
    };

    const onLoadKmlFile = () => {
        const { polygon, circle, marker } = currentMissionReport?.mapView.data ?? {};
        const kml = mapUtils.generateKML({ points: marker, circles: circle, polygons: polygon });
        fileUtils.saveAsUser(new Blob([kml], { type: MIME_TYPE.KML }), currentMissionReport?.docName ?? '', 'kml');
    };

    const onFinishCreate = async (values: IMissionReportForm) => {
        await missionReport.create.run({
            ...values,
            squadIds: values.squadIds.filter(el => !!el),
        });
        hide();
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onFinishUpdate = async (values: IMissionReportForm) => {
        if (!id) return;

        await missionReport.update.run(id, {
            ...values,
            squadIds: values.squadIds.filter(el => !!el),
        });
        hide();
    };

    const onCopy = async () => {
        if (!currentMissionReport) return;

        const values = createCopyValue(currentMissionReport);

        await missionReport.create.run({
            ...values,
            squadIds: values.squadIds.filter(el => !!el),
        });
        hide();
    };

    useAsyncEffect(async () => {
        setLoadingAddress(true);

        try {
            if (initialMap?.marker) {
                const address = await ExternalApi.getGeocode(initialMap.marker);
                // form.setFieldValue('address', str.toAddressString(address));
                // form.setFieldValue('addressDetails', address);
                setInitialAddressDetails(address);
            }
        } catch (error) {
            /* empty */
        }
        setLoadingAddress(false);
    }, []);

    useEffect(() => {
        if (id) {
            missionReport.fetchItem.run(id);
        }

        if (wizard.isCreate) {
            order.fetchList.run();
            missionRequest.fetchList.run();
        }

        employee.fetchListAll.run();
        document.fetchTemplatesList.run();
    }, []);

    const isLoading =
        missionReport.fetchItem.isLoading || employee.fetchListAll.isLoading || document.fetchTemplatesList.isLoading || isLoadingAddress;

    const initialValues: Partial<IMissionReportForm> = useMemo(
        () =>
            wizard.isEdit || wizard.isView
                ? createEditValue(currentMissionReport)
                : createCreateValue(
                      employee.chiefFirst,
                      missionReport.list.first,
                      order.list.first,
                      missionRequest.list.first,
                      employee.squadLeadFirst,
                      initialMap,
                      initialAddressDetails,
                  ),
        [isLoading],
    );

    const onRemove = () => {
        !!id && missionReport.remove.run(id);
        hide();
    };

    const onAddTemplate = () => {
        Modal.show(MODALS.TEMPLATE_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={getTitles(wizard)}
            placement="right"
            width={700}
            onClose={hide}
            extra={
                <WizardButtons
                    onSave={onOpenDocxPreview}
                    {...wizard}
                    isSave={wizard.isSave && !!templateId}
                    menu={[
                        ...(wizard.isView
                            ? [
                                  {
                                      label: 'KML',
                                      key: 'KML',
                                      icon: <Icon.DownloadOutlined />,
                                      onClick: onLoadKmlFile,
                                  },
                              ]
                            : []),
                        ...(wizard.isView && currentMissionReport
                            ? [
                                  {
                                      label: 'Копіювати',
                                      key: 'copy',
                                      icon: <Icon.CopyOutlined />,
                                      onClick: () => onCopy(),
                                  },
                              ]
                            : []),
                    ]}>
                    {wizard.isView && (
                        <Select
                            onAdd={onAddTemplate}
                            value={templateId}
                            onChange={setTemplateId}
                            placeholder="Виберіть шаблон"
                            options={document.missionReportTemplatesList.map(el => ({
                                label: el.data.name,
                                value: el.data.id,
                            }))}
                        />
                    )}
                </WizardButtons>
            }>
            <>
                {isLoadingPreview && <Spin fullscreen />}
                {isLoading ? (
                    <Spin css={s.spin} />
                ) : (
                    <Form
                        name="mission-report-form"
                        onFinish={wizard.isEdit ? onFinishUpdate : onFinishCreate}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={initialValues}
                        disabled={wizard.isView}>
                        {[
                            <Map key="Map" isEdit={!wizard.isView} />,
                            <Territory key="Territory" />,
                            <Approved key="Approved" data={employee.chiefs} selectedEmployee={currentMissionReport?.approvedByAction} />,
                            <Act key="Act" />,
                            <Documents key="Documents" initialValues={initialValues} />,
                            <Timer key="Timer" />,
                            <ExplosiveObjectAction key="ExplosiveObjectAction" />,
                            <ExplosiveDeviceAction key="ExplosiveDeviceAction" />,
                            <Transport
                                key="Transport"
                                initialValues={initialValues}
                                selectedTransportHumanAction={currentMissionReport?.transportHumans}
                                selectedTransportExplosiveAction={currentMissionReport?.transportExplosiveObject}
                            />,
                            <Equipment
                                key="Equipment"
                                initialValues={initialValues}
                                selectedMineDetector={currentMissionReport?.mineDetector}
                            />,
                            <Employees
                                key="Employees"
                                squadLeads={employee.squadLeads}
                                workers={employee.workers}
                                selectedSquadLead={currentMissionReport?.squadLeaderAction}
                                selectedWorkers={currentMissionReport?.squadActions}
                            />,
                        ].map((el, i) => (
                            <div key={i}>
                                {el}
                                <Divider />
                            </div>
                        ))}
                        <WizardFooter
                            {...wizard}
                            onCancel={hide}
                            onRemove={onRemove}
                            loading={missionReport.create.isLoading || missionReport.update.isLoading}
                        />
                    </Form>
                )}
            </>
        </Drawer>
    );
});
