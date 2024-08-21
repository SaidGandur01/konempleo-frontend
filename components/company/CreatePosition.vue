<template>
  <div class="create-position box-shadow-2xl">
    <h2>Crear cargo</h2>
    <div class="form-field">
      <CoreInput
        id="position-id"
        name="text"
        min-length="2"
        label="Cargo"
        placeholder="Nombre del cargo"
        required
        type="text"
        @input="(data) => handleOnInput('position', data)"
      />
      <span v-if="form.position.length < 3" class="error-message">{{
        positionError
      }}</span>
    </div>
    <div class="form-field">
      <CoreInput
        id="skills-id"
        name="skill"
        min-length="2"
        label="Habilidades"
        placeholder="Coloque las habilidades separándolas por comas ',' Ejemplo: Conductor, tractomulas, Certificación C3"
        required
        type="text"
        @input="(data) => handleOnInput('skills', data)"
      />
      <span v-if="form.skills.length < 3" class="error-message">{{
        skillsError
      }}</span>
    </div>
    <div class="button">
      <CoreButton
        size="sm"
        label="Crear cargo"
        :disabled="disableButton"
        @click="onCreatePosition"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
interface ICreatePositionForm {
  position: string;
  skills: string[];
}
const form = ref<ICreatePositionForm>({
  position: "",
  skills: [],
});
const positionError = ref<string>("");
const skillsError = ref<string>("");
const disableButton = ref<boolean>(true);

const handleOnInput = (keyField: string, value: string): void => {
  const currentValue =
    keyField === "position"
      ? value
      : value.split(",").map((skill: string) => skill.trim());

  form.value = {
    ...form.value,
    [keyField]: currentValue,
  };
  validateErrorsForm(keyField, currentValue);
  validateForm();
};

const validateErrorsForm = (
  keyField: string,
  value: string | string[]
): void => {
  switch (keyField) {
    case "position":
      positionError.value = value.length < 3 ? "Inserta un cargo válidos" : "";
      break;
    case "skills":
      skillsError.value =
        value && value[0].length < 3 ? "Agrega al menos una habilidad" : "";
      break;
    default:
      break;
  }
};

const validateForm = (): void => {
  const isPositionValid =
    form.value.position.length >= 3 && positionError.value === "";
  const areSkillsValid =
    form.value.skills.length > 0 &&
    form.value.skills.every((skill) => skill.length >= 3) &&
    skillsError.value === "";
  disableButton.value = !(isPositionValid && areSkillsValid);
};

const onCreatePosition = async (): Promise<void> => {
  const payload: { position: string; skills: string[] } = {
    position: form.value.position,
    skills: form.value.skills,
  };

  console.log(payload);
};
</script>
<style lang="scss" scoped>
  .create-position {
    border-radius: 1rem;
    background-color: var(--background-color-secondary);
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding: 2rem;
    width: 100%;

    h2 {
      font-size: 1.7rem;
    }
  }
</style>
