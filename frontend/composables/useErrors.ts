import { MessageRenderMessage, NAlert } from 'naive-ui';
import { RenderMessageProps } from 'naive-ui/es/message/src/types';
import { apiError } from '~/lib/misc/errors';

export default function useErrors() {
  const { error: showNotice } = useMessage();
  const fieldErrors = ref<any>({});
  const messageTitle = ref('Service Error');

  const render: MessageRenderMessage = (props: RenderMessageProps) => {
    return h(
      NAlert,
      {
        closable: true,
        type: 'error',
        title: messageTitle.value,
        style: {
          boxShadow: 'var(--n-box-shadow)',
          maxWidth: 'calc(100vw - 32px)',
          width: '320px',
        },
      },
      {
        default: () => props.content,
      }
    );
  };

  /**
   * Get messages for error and show notice.
   * Field errors are return separately (errors that have path specified)
   */
  function handleError(e: any, title = 'Service Error', defaultMessage = '') {
    console.error(e);

    const { errors, fields } = apiError(e, true, defaultMessage);

    fieldErrors.value = fields;

    if (errors.length) {
      messageTitle.value = title;
      showNotice(`${errors[0]}`, { render });
    }

    return { errors, fields };
  }

  return {
    fieldErrors,
    handleError,
  };
}
