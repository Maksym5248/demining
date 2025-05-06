import React, { useState, useEffect, memo, useCallback } from 'react';

import { View } from 'react-native';
import { type IAlertParams } from 'shared-my-client';

import { Alert as AlertComponent, Modal } from '~/core';
import { Alert } from '~/services';
import { useStylesCommon } from '~/styles';

import { useStyles } from './alert.styles';

const Component = () => {
    const s = useStyles();
    const styles = useStylesCommon();

    const [data, setData] = useState<IAlertParams>();
    const [isVisible, setVisible] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);

    const onHide = useCallback(() => setVisible(false), []);

    useEffect(() => {
        if (data) {
            setVisible(true);
        }
    }, [data]);

    useEffect(() => {
        const removeListener = Alert.onChange(newData => {
            if (newData) {
                setData(newData);
            } else {
                setVisible(false);
            }
        });

        return () => {
            removeListener();
        };
    }, [setData]);

    const onPressCancel = async () => {
        try {
            if (data?.cancel?.run) {
                await data.cancel.run();
            }
        } catch (error) {
            console.error('Error executing cancel function:', error);
        }

        onHide();
    };

    const onPressConfirm = async () => {
        try {
            !!data?.isVisibleLoading && setLoading(true);
            if (data?.confirm?.run) {
                await data.confirm.run();
            }
        } catch (error) {
            console.error('Error executing cancel function:', error);
        }

        !!data?.isVisibleLoading && setLoading(false);
        onHide();
    };

    return (
        <Modal style={styles.modal} open={() => {}} hide={onHide} isVisible={isVisible}>
            <View style={s.content}>
                {!!data && (
                    <AlertComponent
                        {...data}
                        cancel={{ ...(data ?? {}).cancel, onPress: onPressCancel }}
                        confirm={data?.confirm ? { ...data.confirm, onPress: onPressConfirm, isLoading } : undefined}
                    />
                )}
            </View>
        </Modal>
    );
};

export const AlertProvider = memo(Component);
