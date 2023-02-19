function exportUserInfo(userInfo) {
  const blob = new Blob([userInfo], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = "File Sequence.txt";
  link.href = url;
  link.click();
}
export const downloadHash = (hash) => {
  const blob = new Blob([hash], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = "Root Hash.txt";
  link.href = url;
  link.click();
};

export const downloadSequence = async (data) => {
  let text = "";
  if (data) {
    for (let i = 0; i < data.length; i++) {
      let temp = `${i + 1}. Filename:${data[i].name}  size:${
        data[i].size
      }Bytes\n`;
      text = text + temp;
    }
    exportUserInfo(text);
    console.log(text);
  }
};
