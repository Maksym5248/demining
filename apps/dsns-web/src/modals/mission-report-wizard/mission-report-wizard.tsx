import { useEffect, useState, useMemo } from 'react';

import { Form, Drawer, Divider, Spin, message } from 'antd';
import { observer } from 'mobx-react-lite';

import { Icon, Select, WizardButtons, WizardFooter } from '~/components';
import { MAP_ZOOM, WIZARD_MODE, MODALS, MAP_VIEW_TAKE_PRINT_CONTAINER, MAP_SIZE, MIME_TYPE } from '~/constants';
import { useStore, useWizard } from '~/hooks';
import { Modal, Image, Crashlytics, Template } from '~/services';
import { IEmployee, IMissionReport, IMissionRequest, IOrder, createAddress } from '~/stores';
import { dates, mapUtils, removeFields } from '~/utils';
import { fileUtils } from '~/utils/file';

import { ExplosiveObjectAction, Timer, Transport, Equipment, Approved, Documents, Act, Territory, Employees, Map } from './components';
import { ExplosiveAction } from './components/explosive-action';
import { s } from './mission-report-wizard.styles';
import { IMissionReportForm } from './mission-report-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    hide: () => void;
    mode: WIZARD_MODE;
}

function removeId<T extends { id?: string }>(item: T) {
    return removeFields(item, 'id');
}

const createCopyValue = (currentMissionReport: IMissionReport) => ({
    approvedAt: currentMissionReport?.approvedAt,
    approvedById: currentMissionReport?.approvedByAction?.employeeId,
    number: currentMissionReport.number,
    subNumber: currentMissionReport?.subNumber,
    executedAt: currentMissionReport?.executedAt,
    orderId: currentMissionReport.orderId,
    missionRequestId: currentMissionReport.missionRequestId,
    checkedTerritory: currentMissionReport?.checkedTerritory,
    depthExamination: currentMissionReport?.depthExamination,
    uncheckedTerritory: currentMissionReport?.uncheckedTerritory,
    uncheckedReason: currentMissionReport?.uncheckedReason,
    workStart: currentMissionReport?.workStart,
    exclusionStart: currentMissionReport?.exclusionStart,
    transportingStart: currentMissionReport?.transportingStart,
    destroyedStart: currentMissionReport?.destroyedStart,
    workEnd: currentMissionReport?.workEnd,
    transportExplosiveObjectId: currentMissionReport?.transportExplosiveObject?.transportId,
    transportHumansId: currentMissionReport?.transportHumans?.transportId,
    mineDetectorId: currentMissionReport?.mineDetector?.equipmentId,
    explosiveObjectActions: currentMissionReport?.explosiveObjectActions.map((el) => el.value).map(removeId) ?? [],
    explosiveActions: currentMissionReport?.explosiveActions.map((el) => el.value).map(removeId) ?? [],
    squadLeaderId: currentMissionReport?.squadLeaderAction?.employeeId,
    squadIds: currentMissionReport?.squadActions.map((el) => el.employeeId) ?? [],
    address: currentMissionReport?.address,
    addressDetails: currentMissionReport?.addressDetails,
    mapView: removeId(currentMissionReport.mapView),
});

const createEditValue = (currentMissionReport?: IMissionReport | null) => ({
    approvedAt: currentMissionReport?.approvedAt,
    approvedById: currentMissionReport?.approvedByAction?.employeeId,
    number: currentMissionReport?.number,
    subNumber: currentMissionReport?.subNumber,
    executedAt: currentMissionReport?.executedAt,
    orderId: currentMissionReport?.order?.id,
    missionRequestId: currentMissionReport?.missionRequest?.id,
    checkedTerritory: currentMissionReport?.checkedTerritory,
    depthExamination: currentMissionReport?.depthExamination,
    uncheckedTerritory: currentMissionReport?.uncheckedTerritory,
    uncheckedReason: currentMissionReport?.uncheckedReason,
    workStart: currentMissionReport?.workStart,
    exclusionStart: currentMissionReport?.exclusionStart,
    transportingStart: currentMissionReport?.transportingStart,
    destroyedStart: currentMissionReport?.destroyedStart,
    workEnd: currentMissionReport?.workEnd,
    transportExplosiveObjectId: currentMissionReport?.transportExplosiveObject?.transportId,
    transportHumansId: currentMissionReport?.transportHumans?.transportId,
    mineDetectorId: currentMissionReport?.mineDetector?.equipmentId,
    explosiveObjectActions: currentMissionReport?.explosiveObjectActions.map((el) => el.value) ?? [],
    explosiveActions: currentMissionReport?.explosiveActions.map((el) => el.value) ?? [],
    squadLeaderId: currentMissionReport?.squadLeaderAction?.employeeId,
    squadIds: currentMissionReport?.squadActions.map((el) => el.employeeId) ?? [],
    address: currentMissionReport?.address,
    addressDetails: currentMissionReport?.addressDetails,
    mapView: currentMissionReport?.mapView,
});

const createCreateValue = (
    chiefFirst?: IEmployee,
    firstMissionReport?: IMissionReport,
    firstOrder?: IOrder,
    firstMissionRequest?: IMissionRequest,
    firstSquadLeader?: IEmployee,
) => ({
    approvedAt: dates.today(),
    approvedById: chiefFirst?.id,
    number: firstMissionReport?.subNumber ? firstMissionReport?.number : (firstMissionReport?.number ?? 0) + 1,
    subNumber: firstMissionReport?.subNumber ? (firstMissionReport?.subNumber ?? 0) + 1 : undefined,
    executedAt: dates.today(),
    orderId: firstOrder?.id,
    missionRequestId: firstMissionRequest?.id,
    checkedTerritory: undefined,
    depthExamination: undefined,
    uncheckedTerritory: undefined,
    uncheckedReason: undefined,
    workStart: undefined,
    exclusionStart: undefined,
    transportingStart: undefined,
    destroyedStart: undefined,
    workEnd: undefined,
    transportExplosiveObjectId: undefined,
    transportHumansId: undefined,
    mineDetectorId: undefined,
    explosiveObjectActions: [],
    explosiveActions: [],
    squadLeaderId: firstSquadLeader?.id,
    squadIds: [],
    address: '',
    addressDetails: createAddress(),
    mapView: {
        zoom: MAP_ZOOM.DEFAULT,
    },
});

const getTitles = ({ isEdit, isCreate }: { isEdit: boolean; isCreate: boolean }) => {
    if (isCreate) return 'Створення акту виконаних робіт';
    if (isEdit) return 'Редагування акту виконаних робіт';

    return 'Акт виконаних робіт';
};

export const MissionReportWizardModal = observer(({ id, isVisible, hide, mode = WIZARD_MODE.VIEW }: Props) => {
    const [isLoadingPreview, setLoadingPreview] = useState(false);
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

            const data = {
                ...currentMissionReport.data,
                image: imageData,
            };

            const currentDocument = document.collection.get(templateId);

            if (!currentDocument) throw new Error('there is no selected document');

            const template = await currentDocument.load.run();

            if (!template) return;

            const value = await Template.generateFile(template, data);

            const name = `${currentMissionReport.executedAt.format('YYYY.MM.DD')} ${data.actNumber}`;

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
        const { polygon, circle, marker } = currentMissionReport?.mapView ?? {};
        const kml = mapUtils.generateKML(marker, circle, polygon);
        fileUtils.saveAsUser(new Blob([kml], { type: MIME_TYPE.KML }), currentMissionReport?.docName ?? '', 'kml');
    };

    const onFinishCreate = async (values: IMissionReportForm) => {
        await missionReport.create.run({
            ...values,
            squadIds: values.squadIds.filter((el) => !!el),
        });
        hide();
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onFinishUpdate = async (values: IMissionReportForm) => {
        if (!id) return;

        await missionReport.update.run(id, {
            ...values,
            squadIds: values.squadIds.filter((el) => !!el),
        });
        hide();
    };

    const onCopy = async () => {
        if (!currentMissionReport) return;

        const values = createCopyValue(currentMissionReport);

        await missionReport.create.run({
            ...values,
            squadIds: values.squadIds.filter((el) => !!el),
        });
        hide();
    };

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

    const isLoading = missionReport.fetchItem.isLoading || employee.fetchListAll.isLoading || document.fetchTemplatesList.isLoading;

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
                            options={document.missionReportTemplatesList.map((el) => ({
                                label: el.name,
                                value: el.id,
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
                            <ExplosiveAction key="ExplosiveAction" />,
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
                        <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
                    </Form>
                )}
            </>
        </Drawer>
    );
});
