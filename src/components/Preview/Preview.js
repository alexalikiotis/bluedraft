import { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { BlueprintsContext } from 'src/context/blueprints';
import { FillSpinner } from 'react-spinners-kit';
import PreviewFrame from 'src/components/PreviewFrame';

const CSS = {
  default: 'empty-preview flex h-full',
  loading: 'empty-preview h-full flex flex-col items-center justify-center',
  error: 'h-full bg-red-600 text-white p-2',
};

const fetcher = blueprint => {
  return fetch('https://blueprint-dash-server.herokuapp.com/blueprint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      blueprint: blueprint?.code,
    }),
  })
    .then(response => response.json())
    .then(data => data?.html)
    .catch(err => {
      throw err;
    });
};

const Preview = ({ customClassName }) => {
  const { blueprint } = useContext(BlueprintsContext);
  const { isLoading, error, data, refetch } = useQuery(
    blueprint?.id,
    () => fetcher(blueprint),
    { enabled: !!blueprint }
  );

  useEffect(() => {
    refetch();
  }, [blueprint]);

  return (
    <div className={customClassName}>
      {!blueprint ? (
        <div className={CSS.default} />
      ) : (
        <>
          {error && !isLoading && (
            <div className={CSS.error}>
              <p>{error.message}</p>
            </div>
          )}
          {isLoading && (
            <div className={CSS.loading}>
              <FillSpinner size={50} color="#333642" />
            </div>
          )}
          {data && <PreviewFrame html={data} />}
        </>
      )}
    </div>
  );
};

export default Preview;