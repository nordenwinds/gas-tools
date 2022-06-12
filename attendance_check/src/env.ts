const props: GoogleAppsScript.Properties.Properties =
  PropertiesService.getScriptProperties();

export function env(key: string): string {
  const value: string | null = props.getProperty(key);
  if (!value) throw new Error(`The property '${key}' is not defined.`);

  return value;
}
