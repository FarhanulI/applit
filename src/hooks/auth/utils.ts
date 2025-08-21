/* eslint-disable @typescript-eslint/ban-ts-comment */
// Helper function
// @ts-ignore

function dataURLToBlob(dataURL) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export const handleCheckSessionFile = () => {
  const base64 = sessionStorage.getItem("cvFileBase64");
  const fileName = sessionStorage.getItem("cvFileName");

  if (base64 && fileName) {
    const blob = dataURLToBlob(base64);
    const file = new File([blob], fileName);
    return file;
  }
};
