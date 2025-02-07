export default function uriToFile(uri: string) {
  return {
    uri,
    name: uri.split("/").pop() || "file",
    type: `image/${uri.split(".").pop()}`,
  };
}
