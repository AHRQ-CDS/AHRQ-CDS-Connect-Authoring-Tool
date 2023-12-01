import axios from 'axios';
import FileSaver from 'file-saver';
import { validateArtifact } from 'queries/testing';
import { changeToCase } from 'utils/strings';

const downloadArtifact = async ({ artifact, dataModel }) => {
  artifact.dataModel = dataModel;
  const fileName = changeToCase(`${artifact.name}-v${artifact.version}-cql`, 'snakeCase');
  return axios
    .post(`${process.env.REACT_APP_API_URL}/cql`, artifact, { responseType: 'blob' })
    .then(result => {
      FileSaver.saveAs(result.data, `${fileName}.zip`);
      return result.data;
    })
    .then(async () => {
      return validateArtifact({ artifact, dataModel });
    });
};

export default downloadArtifact;
