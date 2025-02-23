import { Linking } from 'react-native';

const openExternalLink = async (link: string) => {
    const url = /^www\./i.test(link) ? `http://${link}` : link;

    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
        await Linking.openURL(url);
    } else {
        throw new Error('Can not open link');
    }
};

const emailTo = (email: string) => openExternalLink(`mailto:${email}`);

export const externalLink = {
    open: openExternalLink,
    emailTo,
};
