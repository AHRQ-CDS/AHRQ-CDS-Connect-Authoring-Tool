import React from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { CircularProgress } from '@mui/material';

import ExternalCqlDropZone from './ExternalCqlDropZone';
import ExternalCqlTable from './ExternalCqlTable';
import { fetchExternalCqlList } from 'queries/external-cql';

const ExternalCql = () => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const query = { artifactId: artifact._id };
  const { data: externalCqlList, isLoading } = useQuery(['externalCql', query], () => fetchExternalCqlList(query), {
    enabled: artifact._id != null
  });

  return (
    <>
      <ExternalCqlDropZone />

      {isLoading ? <CircularProgress /> : <ExternalCqlTable externalCqlList={externalCqlList ?? []} />}
    </>
  );
};

export default ExternalCql;
