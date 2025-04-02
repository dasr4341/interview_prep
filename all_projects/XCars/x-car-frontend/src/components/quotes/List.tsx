'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import QuotesCards from './QuotesCards';
import catchError from '@/lib/catch-error';
import { useLazyQuery } from '@apollo/client';
import { CONTACT_FORM_DETAILS } from '@/graphql/getContactData.query';
import NoDataFound from '../NoDataFound';
import { ContactsDataInQuoteModel } from '@/generated/graphql';
import { Virtuoso } from 'react-virtuoso';
import QuoteCardLoader from './QuoteCardLoader';

const Footer = () => {
  return <div className="p-8 flex justify-center">Loading...</div>;
};

const List = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [contactData, setContactData] = useState<ContactsDataInQuoteModel[]>(
    []
  );
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [fetchContactData, { loading }] = useLazyQuery(CONTACT_FORM_DETAILS, {
    variables: { page, limit: 10 },
    fetchPolicy: 'network-only',
    onCompleted: (fetchedData) => {
      setContactData((prevData) => [
        ...prevData,
        ...fetchedData.getContactData.data,
      ]);
      if (!fetchedData.getContactData.data.length) {
        setHasMore(false);
      }
    },
    onError: (e) => catchError(e, true),
  });

  const loadMoreData = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
      fetchContactData({ variables: { page: page + 1, limit: 10 } });
    }
  };

  useEffect(() => {
    fetchContactData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full sm:w-11/12 lg:w-3/4 mx-auto overflow-hidden mt-10 flex flex-col gap-6">
      <button
        onClick={() => router.back()}
        className=" text-blue-600 flex items-center font-thin text-md"
      >
        <IoIosArrowBack size={20} /> <span>Back</span>
      </button>
      <div className=" font-extrabold text-orange-600 capitalize text-3xl p-1">
        My quotes
      </div>
      <div className=" rounded-lg flex flex-col gap-4 items-start">
        {contactData && (
          <button className=" font-light text-sm  rounded-md flex gap-3   px-4 py-1 items-center text-gray-700 border border-gray-400">
            Total Quotes
            <div className=" text-xs p-3 rounded-full h-3 flex items-center justify-center w-3 bg-gray-300 text-gray-600">
              {contactData?.length}
            </div>
          </button>
        )}
        <div className="w-full flex flex-col gap-4 items-start h-[calc(100vh-300px)] overflow-scroll">
          {!!(!loading && contactData?.length) && (
            <Virtuoso
              className="w-full h-[calc(100vh-300px)]"
              style={{ height: 600 }}
              data={contactData}
              endReached={loadMoreData}
              increaseViewportBy={200}
              itemContent={(index, contact) => {
                return (
                  <QuotesCards
                    key={contact.id}
                    count={index + 1}
                    quoteData={contact}
                  />
                );
              }}
              components={{ Footer: () => loading && <Footer /> }}
            />
          )}
          {loading && <QuoteCardLoader />}
          {!loading && !contactData?.length && <NoDataFound />}
        </div>
      </div>
    </div>
  );
};

export default List;
