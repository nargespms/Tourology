/**
 * It parses the nested files field name to an object of array like
 *  files[attachment][] to { attachment: [file1, file2] }
 * @param files - An array of files
 * @param fieldName - The field name to parse
 * @returns An object of arrays
 */
export const parseFiles = (files, fieldName = 'files') => {
  const parsedFiles = {};

  files.forEach((file) => {
    const match = file.fieldname.match(new RegExp(`${fieldName}\\[(.+)\\]`));;

    if (match) {
      // normalize the key by removing [ and ] and replace spaces and slashes with _
      const key = match[1].replace(/[[\]]*/g, '').replace(/[\s/\\]/g, '_');

      if (!parsedFiles[key]) {
        parsedFiles[key] = [];
      }

      parsedFiles[key].push(file);
    }
  });

  return parsedFiles;
};