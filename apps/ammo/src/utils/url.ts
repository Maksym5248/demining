import { Linking } from 'react-native';
import { openInbox } from 'react-native-email-link';

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
const emailApp = () => openInbox();

export const externalLink = {
    open: openExternalLink,
    emailTo,
    emailApp,
};
