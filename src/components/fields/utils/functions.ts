export const getFilteredOptions = (
  options: any[],
  input: string,
  getOptionLabel: (option: any) => string
) =>
  options?.filter((option) => {
    const label = getOptionLabel(option)?.toString().toLowerCase();
    return label?.includes(input.toLowerCase());
  });

export const handleRemove = (index: number, onChange, values: any[]) => {
  onChange([...values?.slice(0, index), ...values?.slice(index + 1)]);
};
