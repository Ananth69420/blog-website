const sluggify = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-");
};
// sluggify("How to Learn Backend in 30 Days");
module.exports = sluggify;
