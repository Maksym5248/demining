import { TemplateHandler } from 'easy-template-x';

// 1. read template file

// (in this example we're loading the template by performing  
//  an AJAX call using the fetch API, another common way to  
//  get your hand on a Blob is to use an HTML File Input)
const response = await fetch('http://somewhere.com/myTemplate.docx');
const templateFile = await response.blob();

// 2. process the template
const data = {
    posts: [
        { author: 'Alon Bar', text: 'Very important\ntext here!' },
        { author: 'Alon Bar', text: 'Forgot to mention that...' }
    ]
};

const handler = new TemplateHandler();
const doc = await handler.process(templateFile, data);

// 3. save output
saveFile('myTemplate - output.docx', doc);

function saveFile(filename, blob) {

    // see: https://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link

    // get downloadable url from the blob
    const blobUrl = URL.createObjectURL(blob);

    // create temp link element
    let link = document.createElement("a");
    link.download = filename;
    link.href = blobUrl;

    // use the link to invoke a download
    document.body.appendChild(link);
    link.click();

    // remove the link
    setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
        link = null;
    }, 0);
}