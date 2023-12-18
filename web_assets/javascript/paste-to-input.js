
// 参考:
// https://github.com/binary-husky/gpt_academic/tree/master/themes/common.js
// @Kilig947


function setPasteUploader() {
    input = user_input_tb.querySelector("textarea")
    let paste_files = [];
    if (input) {
        input.addEventListener("paste", async function (e) {
            const clipboardData = e.clipboardData || window.clipboardData;
            const items = clipboardData.items;
            if (items) {
                for (i = 0; i < items.length; i++) {
                    if (items[i].kind === "file") { // 确保是文件类型
                        const file = items[i].getAsFile();
                        // 将每一个粘贴的文件添加到files数组中
                        paste_files.push(file);
                        e.preventDefault();  // 避免粘贴文件名到输入框
                    }
                }
                if (paste_files.length > 0) {
                    // 按照文件列表执行批量上传逻辑
                    await paste_upload_files(paste_files);
                    paste_files = []

                }
            }
        });
    }
}


async function paste_upload_files(files) {
    const uploadInputElement = gradioApp().querySelector("#upload-index-file > .center.flex input[type=file]");
    let totalSizeMb = 0
    if (files && files.length > 0) {
        // 执行具体的上传逻辑
        if (uploadInputElement) {
            for (let i = 0; i < files.length; i++) {
                // 将从文件数组中获取的文件大小(单位为字节)转换为MB，
                totalSizeMb += files[i].size / 1024 / 1024;
            }
            // 检查文件总大小是否超过20MB
            if (totalSizeMb > 20) {
                // toast_push('⚠️文件夹大于20MB 🚀上传文件中', 2000)
                // return;  // 如果超过了指定大小, 可以不进行后续上传操作
            }
             // 监听change事件， 原生Gradio可以实现
            // uploadInputElement.addEventListener('change', function(){replace_input_string()});
            let event = new Event("change");
            Object.defineProperty(event, "target", {value: uploadInputElement, enumerable: true});
            Object.defineProperty(event, "currentTarget", {value: uploadInputElement, enumerable: true});
            Object.defineProperty(uploadInputElement, "files", {value: files, enumerable: true});
            uploadInputElement.dispatchEvent(event);
        } else {
            statusDisplayMessage(clearFileHistoryMsg_i18n);
            return;
        }
    }
}

