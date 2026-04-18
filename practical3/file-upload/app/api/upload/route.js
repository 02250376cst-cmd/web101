import formidable from "formidable";
import path from "path";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req) {
  return new Promise((resolve) => {
    const form = formidable({
      uploadDir: path.join(process.cwd(), "public/uploads"),
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        resolve(new Response(JSON.stringify({ error: err.message }), { status: 400 }));
        return;
      }

      const file = files.file?.[0];
      if (!file) {
        resolve(new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 }));
        return;
      }

      resolve(
        new Response(
          JSON.stringify({
            message: "File uploaded successfully",
            filename: path.basename(file.filepath),
            url: `/uploads/${path.basename(file.filepath)}`,
          }),
          { status: 200 }
        )
      );
    });
  });
}
