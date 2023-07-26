/* 
 * Returns a compiled WARNO
 */
import { promises as fs } from "fs" // use HTTPS instead to just fetch the page
import { marked } from 'marked'
import * as path from 'path';

/* Set options for marked */
marked.use({
    gfm: true,
    breaks: true,
    headerIds: false,
    mangle: false
});

export default defineEventHandler(async (event) => {
    const query = await getQuery(event)
    const warno: string | null = query.warno as string;

    return new Promise(async (resolve, reject) => {
        if (warno) {
            try {
                /* Sanitize data */
                var filename = warno.replace(/([^\w\s\d\-_~,;\[\]\(\).])/g, '');
                filename = filename.replace(/([\.]{2,})/g, '');

                const data = await fs.readFile(path.resolve() + '/public/uploads/' + filename + '.sqf');
                const compiledData = data.toString().match(/"([\S\s]*?)",/g);

                const formattedData = compiledData?.map((value) => {
                    value = value.replace(/"([\S\s]*?)",/g, "$1"); // Remove outer quotes
                    value = value.replace(/""/g, "\""); // Remove extra quotes
                    value = marked.parse(value); // Parse markdown

                    return value;
                });

                resolve(formattedData);
            } catch (error) {
                reject(error);
            };
        } else {
            reject("Missing query parameter: warno");
        };
    });
});