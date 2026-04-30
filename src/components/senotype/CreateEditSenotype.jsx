import SenotypeForm from './SenotypeForm';

/**
 * TODO:// build edit form
 * @param {*} param0
 * @returns
 */
function CreateEditSenotype({ isEdit = false }) {

  return (
    <>
      <div className="c-senotype">
        <SenotypeForm isEdit={isEdit} />
      </div>
    </>
  );
}

export default CreateEditSenotype;
