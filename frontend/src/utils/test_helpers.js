import _ from 'lodash';

function createTemplateInstance(template, children = undefined) {
  const instance = _.cloneDeep(template);
  instance.uniqueId = _.uniqueId(instance.id);

  if (template.conjunction) {
    instance.childInstances = children || [];
  }

  return instance;
}

function createDataTransferEventWithFiles(files = []) {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        size: file.size,
        type: file.type,
        getAsFile: () => file
      })),
      types: ['Files']
    }
  };
}

function createFile({ name, size, type, contents = [] }) {
  const file = new File(contents, name, { type });
  Object.defineProperty(file, 'size', {
    get() {
      return size;
    }
  });
  return file;
}

export { createTemplateInstance, createDataTransferEventWithFiles, createFile };
