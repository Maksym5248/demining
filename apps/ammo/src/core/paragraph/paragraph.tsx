import { Text as RNText } from 'react-native';

import { useStyles } from './paragraph.style';
import { type IParagraphProps } from './paragraph.type';
import { Text } from '../text';

export const Paragraph = ({ style, text, ...props }: IParagraphProps) => {
    const s = useStyles();
    const str = String(text);

    return (
        <Text style={[s.text, style]} {...props}>
            {str?.split('\n').map((line, index) => (
                <RNText key={index} style={[s.line, index === 0 && line.trim() === '' ? s.firstLineMargin : null]}>
                    {line}
                    {index < str.split('\n').length - 1 && '\n'}
                </RNText>
            ))}
        </Text>
    );
};
