import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useLatest } from 'react-use';
import { List as ListIcon } from '@material-ui/icons';

import ValueSetDetailsTable from './ValueSetDetailsTable';
import ValueSetSearchResultsTable from './ValueSetSearchResultsTable';
import ValueSetSelectModalHeader from './ValueSetSelectModalHeader';
import { Modal } from 'components/elements';
import useStyles from '../styles';

const ValueSetSelectModal = ({ handleCloseModal, handleSelectValueSet, readOnly = false, savedValueSet }) => {
  const [selectedValueSet, setSelectedValueSet] = useState(savedValueSet);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [searchCount, setSearchCount] = useState(null);
  const selectedValueSetRef = useLatest(selectedValueSet);
  const styles = useStyles();

  const handleSaveValueSetSelection = useCallback(() => {
    handleSelectValueSet(selectedValueSetRef.current);
    handleCloseModal();
  }, [handleCloseModal, handleSelectValueSet, selectedValueSetRef]);

  return (
    <Modal
      closeButtonText={readOnly ? 'Close' : 'Cancel'}
      handleCloseModal={handleCloseModal}
      handleSaveModal={handleSaveValueSetSelection}
      isOpen
      hasCancelButton
      hasEnterKeySubmit={false}
      hasTitleIcon={searchCount > 0}
      hideSubmitButton={readOnly}
      Header={
        <ValueSetSelectModalHeader
          goBack={() => setSelectedValueSet(null)}
          onSearch={setSearchKeyword}
          readOnly={readOnly}
          selectedValueSet={selectedValueSet}
        />
      }
      maxWidth="xl"
      submitButtonText="Select"
      submitDisabled={!selectedValueSet}
      title={readOnly ? 'View value set' : 'Choose value set'}
      TitleIcon={
        <>
          <ListIcon /> {selectedValueSet ? 1 : searchCount}
        </>
      }
    >
      <div className={styles.content}>
        {selectedValueSet ? (
          <ValueSetDetailsTable valueSetOid={selectedValueSet.oid} />
        ) : (
          <ValueSetSearchResultsTable
            keyword={searchKeyword}
            setSearchCount={setSearchCount}
            setSelectedValueSet={setSelectedValueSet}
          />
        )}
      </div>
    </Modal>
  );
};

ValueSetSelectModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  handleSelectValueSet: PropTypes.func,
  readOnly: PropTypes.bool,
  savedValueSet: PropTypes.shape({ name: PropTypes.string.isRequired, oid: PropTypes.string.isRequired })
};

export default ValueSetSelectModal;
