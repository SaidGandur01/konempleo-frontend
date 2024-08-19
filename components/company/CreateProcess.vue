<template>
  <div class="create-process">
    <h2>Crear Proceso</h2>
    <div class="form-field">
      <CoreInput
        id="process-id"
        name="text"
        min-length="2"
        label="Nombre del proceso"
        placeholder="Nombre del proceso"
        required
        type="text"
        @input="(data) => handleOnInput('process_name', data)"
      />
      <span v-if="form.process_name.length < 3" class="error-message">{{
        processNameError
      }}</span>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDropdown
          :list-options="locationListData"
          label="Ubicación"
          placeholder="Seleccione una ciudad"
          @select="(data) => handleOnInput('location', data)"
        />
        <span v-if="form.location.length < 1" class="error-message">{{
          locationError
        }}</span>
      </div>
      <div class="form-field">
        <CoreDropdown
          :list-options="positionListData"
          label="Cargo"
          placeholder="Seleccione un cargo"
          @select="(data) => handleOnInput('position', data)"
        />
        <span v-if="form.position.length < 1" class="error-message">{{
          positionError
        }}</span>
      </div>
    </div>
    <div class="form-group">
      <div class="form-field">
        <CoreDropdown
          :list-options="educationListData"
          label="Educación Mínima"
          placeholder="Seleccione un opción"
          @select="(data) => handleOnInput('education', data)"
        />
        <span v-if="form.education.length < 1" class="error-message">{{
          educationError
        }}</span>
      </div>
      <div class="form-field">
        <CoreDropdown
          :list-options="genderListData"
          label="Género"
          placeholder="Seleccione un opción"
          @select="(data) => handleOnInput('gender', data)"
        />
        <span v-if="form.gender.length < 1" class="error-message">{{
          genderError
        }}</span>
      </div>
      <div class="form-field">
        <CoreInput
          id="position-availables-id"
          name="text"
          min-length="2"
          label="Número de puestos disponibles"
          placeholder="Nombre del proceso"
          required
          type="number"
          :value="1"
          @input="(data) => handleOnInput('max_positions', data)"
        />
        <span v-if="form.max_positions < 1" class="error-message">{{
          maxPositionsError
        }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { educationListData } from "~/data/education/education";
import { genderListData } from "~/data/gender/gender";
import { locationListData } from "~/data/locations/locations";
import { positionListData } from "~/data/positions/positions";

interface ICreateProcessForm {
  process_name: string;
  location: string;
  position: string;
  education: string;
  gender: string;
  max_positions: number;
}
const form = ref<ICreateProcessForm>({
  process_name: "",
  location: "",
  position: "",
  education: "",
  gender: "",
  max_positions: 1,
});
const processNameError = ref<string>("");
const locationError = ref<string>("");
const positionError = ref<string>("");
const educationError = ref<string>("");
const genderError = ref<string>("");
const maxPositionsError = ref<string>("");

const handleOnInput = (keyField: string, value: string): void => {
  console.log({
    keyField,
    value,
  });
  form.value = {
    ...form.value,
    [keyField]: value,
  };

  console.log(form.value);
};
</script>
<style lang="scss" scoped>
.create-process {
  border-radius: 1rem;
  border: 1px solid #6e718b;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 2rem;
  width: 100%;

  h2 {
    font-size: 1.7rem;
  }

  .form-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 3rem;

    .form-field {
      width: 100%;
    }
  }

  .form-field {
    .error-message {
      display: block;
      color: var(--color-text-900);
      margin: 1rem 0;
      font-size: 1.2rem;
      font-weight: 500;
      letter-spacing: 1px;
    }
  }
}
</style>
