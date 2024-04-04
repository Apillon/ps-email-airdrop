import { useWaitForTransaction } from 'use-wagmi';

/**
 * Usage:
 * const txWait = useTxWait();
 * txWait.hash.value = '';
 * await txWait.wait();
 */
export default function useTxWait() {
  const hash = ref<`0x${string}` | undefined>(undefined);

  const { refetch } = useWaitForTransaction({
    enabled: false,
    hash,
  });

  async function wait() {
    await sleep(50);
    return await refetch();
  }

  return {
    hash,
    wait,
  };
}
