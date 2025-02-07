export default function toFormData(obj: Record<string, any>) {
  const formData = new FormData();

  for (const key in obj) {
    formData.append(key, obj[key]);
  }

  return formData;
}
