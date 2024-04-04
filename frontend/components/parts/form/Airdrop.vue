<template>
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      @submit.prevent="handleSubmit"
    >
      <!--  Title -->
      <n-form-item path="domain" label="Title" :label-props="{ for: 'title' }">
        <n-input
          v-model:value="formData.title"
          :input-props="{ id: 'title', type: 'text' }"
          placeholder="Type text here"
          clearable
        />
      </n-form-item>

      <!--  NFT Collection -->
      <n-form-item
        path="collection_uuid"
        label="NFT Collection Source"
        :label-props="{ for: 'collection_uuid' }"
      >
        <select-options
          v-model:value="formData.collection_uuid"
          :options="nftCollections"
          :input-props="{ id: 'collection_uuid' }"
          placeholder="Select or type NFT Collection"
          autocomplete="off"
          filterable
          clearable
          tag
        />
      </n-form-item>

      <!--  Domain -->
      <n-form-item path="domain" label="Domain" :label-props="{ for: 'domain' }">
        <n-input
          v-model:value="formData.domain"
          :input-props="{ id: 'domain', type: 'text' }"
          placeholder="Type text here"
          clearable
        />
      </n-form-item>


      <!--  Form submit -->
      <n-form-item :show-label="false" :show-feedback="false">
        <input type="submit" class="hidden" />
        <Btn
          type="primary"
          class="w-full mt-2"
          :loading="loading"
          @click="handleSubmit"
        >
          Start new airdrop
        </Btn>
      </n-form-item>
    </n-form>
</template>

<script lang="ts" setup>
import { ruleRequired } from '~/lib/utils/validation';
import { FormInst, FormItemRule, FormRules, FormValidationError } from 'naive-ui';

type FormWebsiteDomain = {
  collection_uuid: string | null;
  domain: string | null;
  title: string | null;
};

const props = defineProps({
  websiteUuid: { type: String, default: null },
});
const emit = defineEmits(['submitSuccess']);

const message = useMessage();

const loading = ref(false);
const formRef = ref<FormInst | null>(null);

const formData = ref<FormWebsiteDomain>({
  collection_uuid: null,
  domain: null,
  title: null,
});

const rules: FormRules = {
  collection_uuid: [ruleRequired("Please select NFT collection")],
  domain: [
    {
      type: 'url',
      validator: validateDomain,
      message: 'Domain name is not a valid URL',
    },
  ],
};

const nftCollections = []

function validateDomain(_: FormItemRule, value: string): boolean {
  const regex = /^[a-zA-Z0-9][a-zA-Z0-9-.]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

  return !value || regex.test(value);
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.error(error.message || 'Error')));
    } else {
      // await airdrop();
    }
  });
}

async function airdrop() {
  loading.value = true;

  try {
    const res = await $api.post<any>(
      '/',
      formData.value
    );

    message.success('');

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    // message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}


</script>lib/utils/validation