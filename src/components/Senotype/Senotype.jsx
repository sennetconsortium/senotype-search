import EditContext from '@/context/EditContext';
import React, { useContext } from 'react';
import SenotypeForm from './SenotypeForm';

function Senotype({}) {
  const { senotype } = useContext(EditContext);
  if (!senotype) {
    return <SenotypeForm />;
  }
  return (
    <>
      <div className="c-senotype">
        <h1 className="h3">{senotype.senotypeid}</h1>
      </div>
    </>
  );
}

export default Senotype;
