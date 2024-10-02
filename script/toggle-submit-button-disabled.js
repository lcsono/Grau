export function toggleSubmitButtonDisabled(
	button,
	defaultMessage,
	waitingMessage = 'Aguarde...'
) {
	if (!button.disabled) {
		button.style.backgroundColor = 'var(--disabled)';
		button.value = waitingMessage;
		button.disabled = true;
	} else {
		button.style.backgroundColor = 'var(--primary-color)';
		button.value = defaultMessage;
		button.disabled = false;
	}
}
