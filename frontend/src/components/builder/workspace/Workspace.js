import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';

import { saveArtifact, downloadArtifact, fetchArtifact, initializeArtifact } from 'queries/artifacts';
import { fetchExternalCqlList } from 'queries/external-cql';
import { artifactSaved, loadArtifact } from 'actions/artifacts';
import { setScrollToId } from 'actions/navigation';
import { useSpacingStyles } from 'styles/hooks';
import useStyles from './styles';

import WorkspaceHeader from './WorkspaceHeader';
import WorkspaceTabs from './WorkspaceTabs';
import isBlankArtifact from 'utils/artifacts/isBlankArtifact';
import { ErrorPage } from 'components/base';

const Workspace = ({ match }) => {
  const spacingStyles = useSpacingStyles();
  const styles = useStyles();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const artifactRef = useRef();
  const artifactId = match.params.id;
  const [statusMessage, setStatusMessage] = useState('');
  const artifact = useSelector(state => state.artifacts.artifact);
  const scrollToId = useSelector(state => state.navigation.scrollToId);
  const externalCqlQuery = { artifactId };
  const { data: externalCqlList } = useQuery(
    ['externalCql', externalCqlQuery],
    () => fetchExternalCqlList(externalCqlQuery),
    { enabled: externalCqlQuery.artifactId != null }
  );
  const { mutate: invokeFetchArtifact, isLoading } = useMutation(fetchArtifact);
  const handleLoadArtifact = useCallback(
    id => {
      invokeFetchArtifact({ artifactId: id }, { onSuccess: data => dispatch(loadArtifact(data)) });
    },
    [invokeFetchArtifact, dispatch]
  );
  const { mutate: invokeInitializeArtifact } = useMutation(initializeArtifact);
  const handleInitializeArtifact = useCallback(
    () => invokeInitializeArtifact({}, { onSuccess: data => dispatch(loadArtifact(data)) }),
    [invokeInitializeArtifact, dispatch]
  );
  const { mutate: invokeSaveArtifact } = useMutation(saveArtifact);
  const handleSaveArtifact = useCallback(
    (artifact, artifactProps, updateStatusMessage = true) =>
      invokeSaveArtifact(
        { artifact, artifactProps },
        {
          onSuccess: data => {
            queryClient.invalidateQueries('artifacts');
            dispatch(artifactSaved(data));
            if (updateStatusMessage) setStatusMessage(`Last saved ${moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}`);
          },
          onError: error => {
            if (updateStatusMessage) setStatusMessage(`Save failed. ${error.message ?? 'Unknown error'}`);
          }
        }
      ),
    [invokeSaveArtifact, queryClient, dispatch]
  );
  const { mutateAsync: invokeDownloadArtifact } = useMutation(downloadArtifact, {
    onSuccess: () => {
      setStatusMessage(`Downloaded ${moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}`);
    },
    onError: error => {
      setStatusMessage(`Download failed. ${error.message ?? 'Unknown error'}.`);
    }
  });

  // Scroll when navigating to an element from a link
  useEffect(() => {
    const elementToScrollTo = document.getElementById(scrollToId);
    if (elementToScrollTo) elementToScrollTo.scrollIntoView();
    dispatch(setScrollToId(null));
  }, [scrollToId, dispatch]);

  // Load the artifact id specified in the URL into the global redux state
  useEffect(() => {
    if (match.params.id == null) {
      handleInitializeArtifact();
    } else {
      handleLoadArtifact(match.params.id);
    }
    // NOTE: This is only safe because this useEffect should only run when the component mounts
    // It will never re-run, but that is what we want in this case.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track ref to use when saving when unmounting
  useEffect(() => {
    artifactRef.current = artifact;
  }, [artifact]);

  // Save artifact on unmount
  // Note: unmount happens when the component unmounts within the AT react app.
  // It isn't called when refreshing the page or navigating away from the AT.
  useEffect(() => {
    return () => {
      if (!isBlankArtifact(artifactRef.current)) {
        handleSaveArtifact(artifactRef.current, {}, false);
      }
    };
  }, [handleSaveArtifact]);

  if (artifact == null) {
    if (isLoading) {
      return <CircularProgress />;
    }
    return <ErrorPage errorType="notFound" />;
  }

  return (
    <div className={styles.root}>
      <div className={spacingStyles.globalPadding}>
        <div className={styles.workspace}>
          <WorkspaceHeader
            handleDownloadArtifact={(artifact, dataModel) => invokeDownloadArtifact({ artifact, dataModel })}
            handleSaveArtifact={handleSaveArtifact}
            statusMessage={statusMessage}
          />
          <WorkspaceTabs externalCqlList={externalCqlList ?? []} handleSaveArtifact={handleSaveArtifact} />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
