import { createFormHook } from "@tanstack/react-form";

import { EndDateField } from "#/components/form/end-date-field";
import { MonthField } from "#/components/form/month-field";
import { SkillsField } from "#/components/form/skills-field.tsx";
import { SubmitButton } from "#/components/form/submit-button";
import { TextField } from "#/components/form/text-field";
import { TextareaField } from "#/components/form/textarea-field";

import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withFieldGroup, withForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: { TextField, TextareaField, MonthField, EndDateField, SkillsField },
	formComponents: { SubmitButton },
});
