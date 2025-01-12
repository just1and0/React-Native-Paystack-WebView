export const buildKeyValueString = (key: string, value: string | undefined) =>
    value ? `${key}: '${value}',` : '';
  
  export const dynamicSplitObjectIsValid = (split: any): boolean => {
    return (
      split !== null &&
      typeof split === 'object' &&
      split.type &&
      split.bearer_type &&
      Array.isArray(split.subaccounts)
    );
  };
  
  export const generateMetaDataString = (firstName: string, lastName: string, billingName: string, metadata: any) => {
    return metadata
      ? `metadata: ${metadata},`
      : `metadata: { custom_fields: [{ display_name:  '${firstName + " " + lastName}', variable_name:  '${billingName}', value:'' }]},`;
  };
  