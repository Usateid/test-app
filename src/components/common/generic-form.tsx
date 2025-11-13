import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
export default function GenericForm({
  options,
  state,
}: {
  options: { name: string; type: string; values?: string[] }[];
  state: { [key: string]: unknown; fieldErrors?: Record<string, string> };
}) {
  return (
    <FieldGroup className="my-4 flex flex-col gap-4">
      {options.map((option) => (
        <Field key={option.name}>
          <FieldLabel htmlFor={option.name}>
            {option.name.charAt(0).toUpperCase() + option.name.slice(1)}
          </FieldLabel>
          {option.type === "select" ? (
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={option.name} />
              </SelectTrigger>
              <SelectContent>
                {option.values?.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              name={option.name}
              type={option.type}
              id={option.name}
              defaultValue={state[option.name] as string}
              className="block w-full rounded-md border border-gray-300 px-3 shadow-sm focus:border-sage-500 focus:outline-none focus:ring-sage-500"
              required
            />
          )}
          <FieldError>{state.fieldErrors?.[option.name]}</FieldError>
        </Field>
      ))}
    </FieldGroup>
  );
}
