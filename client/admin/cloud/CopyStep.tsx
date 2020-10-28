import { Box, Button, ButtonGroup, Icon, Scrollable, Modal } from '@rocket.chat/fuselage';
import Clipboard from 'clipboard';
import React, { useEffect, useState, useRef, FC } from 'react';

import { useTranslation } from '../../contexts/TranslationContext';
import { useMethod } from '../../contexts/ServerContext';
import { useToastMessageDispatch } from '../../contexts/ToastMessagesContext';
import MarkdownText from '../../components/basic/MarkdownText';
import { cloudConsoleUrl } from './constants';

type CopyStepProps = {
	onNextButtonClick: () => void;
};

const CopyStep: FC<CopyStepProps> = ({ onNextButtonClick }) => {
	const t = useTranslation();
	const dispatchToastMessage = useToastMessageDispatch();

	const [clientKey, setClientKey] = useState('');

	const getWorkspaceRegisterData = useMethod('cloud:getWorkspaceRegisterData');

	useEffect(() => {
		const loadWorkspaceRegisterData = async (): Promise<void> => {
			const clientKey = await getWorkspaceRegisterData();
			setClientKey(clientKey);
		};

		loadWorkspaceRegisterData();
	}, [getWorkspaceRegisterData]);

	const copyRef = useRef<Element>();

	useEffect(() => {
		if (!copyRef.current) {
			return;
		}

		const clipboard	= new Clipboard(copyRef.current);
		clipboard.on('success', () => {
			dispatchToastMessage({ type: 'success', message: t('Copied') });
		});

		return (): void => {
			clipboard.destroy();
		};
	}, [dispatchToastMessage, t]);

	return <>
		<Modal.Content>
			<Box withRichContent>
				<p>{t('Cloud_register_offline_helper')}</p>
			</Box>
			<Box
				display='flex'
				flexDirection='column'
				alignItems='stretch'
				padding='x16'
				flexGrow={1}
				backgroundColor='neutral-800'
			>
				<Scrollable vertical>
					<Box
						height='x108'
						fontFamily='mono'
						fontScale='p1'
						color='alternative'
						style={{ wordBreak: 'break-all' }}
					>
						{clientKey}
					</Box>
				</Scrollable>
				<Button ref={copyRef} primary data-clipboard-text={clientKey}>
					<Icon name='copy' /> {t('Copy')}
				</Button>
			</Box>
			<MarkdownText is='p' preserveHtml={true} withRichContent content={t('Cloud_click_here', { cloudConsoleUrl })} />
		</Modal.Content>
		<Modal.Footer>
			<ButtonGroup>
				<Button primary onClick={onNextButtonClick}>{t('Next')}</Button>
			</ButtonGroup>
		</Modal.Footer>
	</>;
};

export default CopyStep;
