import { useLazyQuery } from '@apollo/client';
import Button from 'components/ui/button/Button';
import NoDataFound from 'components/NoDataFound';
import { SearchField } from 'components/SearchField';
import { TagLozenge } from 'components/TagLozenge';
import { FindManyContacts, FindManyContactsVariables } from 'generatedTypes';
import { UrlQueryOptions } from 'interface/url-query.interface';
import { FindManyContactsQuery } from 'lib/query/contacts/find-many-contacts';
import React, { useEffect, useState } from 'react';
import { BsPlusCircle } from 'react-icons/bs';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Popup from 'reactjs-popup';

export default function ContactList({
  onContactChange,
  onEmailChange,
  companyId,
}: {
  onContactChange: any;
  onEmailChange: any;
  companyId: string;
}) {
  // Hooks for getting contact
  const [getContacts, { data: contactData }] = useLazyQuery<FindManyContacts, FindManyContactsVariables>(
    FindManyContactsQuery
  );

  const contactLists = [{ label: 'Select Contacts', value: '', checked: false }];
  const [open, setOpen] = useState(false);
  const [optionList, setOptionList] = useState(contactLists);
  const [selectedList, setSelectedList] = useState<UrlQueryOptions[]>(contactLists);
  const [selectedVal, setSelectedVal] = useState<any>([]);
  useEffect(() => {
    getContacts({
      variables: {
        companyId: String(companyId),
        take: 20,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (contactData?.pretaaFindManyCompanyContacts) {
      const contacts = contactData?.pretaaFindManyCompanyContacts?.map((x) => {
        const selectedContact = selectedList.filter((y) => y.value === String(x.id));
        return {
          label: x.name,
          value: String(x.id),
          checked: selectedContact?.length > 0 ? true : false,
        };
      });
      setOptionList(contacts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactData]);
  useEffect(() => {
    getContacts({
      variables: {
        companyId: String(companyId),
        take: 20,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const handleInputChange = (phrase: string) => {
    if (phrase?.length > 0) {
      getContacts({
        variables: {
          searchPhrase: phrase,
          companyId: String(companyId),
        },
      });
    } else {
      getContacts({
        variables: {
          companyId: String(companyId),
          take: 20,
        },
      });
    }
  };

  function changeOption(index: number, e: any) {
    // optionList[index].checked = e.target.checked as boolean;
    // setOptionList(optionList);

    const indexVal = selectedVal.findIndex((o: any) => o.value === e.target.value);
    if (indexVal > -1) {
      selectedVal[indexVal].checked = e.target.checked as boolean;
      setSelectedVal(selectedVal);
    } else {
      setSelectedVal(
        selectedVal.concat({
          label: optionList[index].label,
          checked: e.target.checked as boolean,
          value: e.target.value,
        })
      );
    }
  }
  const closeModal = () => {
    setOpen(false);
    const selected = selectedVal.filter((option: any) => option.checked);
    const filterObj = [...selectedList, ...selected].filter(
      (item) => selected.map((x: any) => x.value).indexOf(item.value) === -1 && item.value
    );

    setSelectedList([...filterObj, ...selected]);
    const selectedObj = [...selected]?.map((x) => {
      return {
        contact: {
          connect: {
            id: x.value,
          },
        },
      };
    });
    if (selectedObj.length === 0) {
      onContactChange(undefined);
    } else {
      onContactChange(selectedObj);
    }
  };

  const lists = optionList.map((contact, index) => {
    let status = false;
    const indexVal = selectedVal.findIndex((o: any) => o.value === contact.value);
    if (indexVal > -1) {
      status = selectedVal[indexVal].checked;
    }
    return (
      <div className="py-3 border-b last:border-0" key={contact?.value}>
        {contact?.value && (
          <label data-testid="contacts" className="flex items-center space-x-3 uppercase">
            <input
              type="checkbox"
              value={contact.value}
              defaultChecked={status}
              className={`appearance-none h-5 w-5 border
              border-primary-light ml-1
              checked:bg-primary-light checked:border-transparent
              rounded-md form-tick`}
              onChange={(e) => changeOption(index, e)}
            />
            <span className="text-primary font-semibold text-xs">{contact.label}</span>
          </label>
        )}
      </div>
    );
  });

  return (
    <>
      <div className="flex flex-1 flex-wrap">
        <TagLozenge
          onChange={(list) => {
            const uList = list.filter((i) => i.checked);
            setSelectedList(uList);
            if (uList.length == 0) {
              onContactChange(undefined);
            } else {
              const selectedObj = uList?.map((x) => {
                return {
                  contact: {
                    connect: {
                      id: x.value,
                    },
                  },
                };
              });
              onContactChange(selectedObj);
            }
          }}
          tags={selectedList}
          className={['ml-1 mb-1 inline']}
        />
        <input
          type="text"
          className="input-email__template flex-1"
          onChange={(value) => onEmailChange(value.target.value)}
          // {...register('subject')}
          data-test-id="email-input"
        />
      </div>
      <button type="button" onClick={() => setOpen((o) => !o)} data-testid="open-user-selection-modal">
        <BsPlusCircle className="text-primary-light ml-1" />
      </button>
      {open && (
        <Popup open={open} closeOnDocumentClick onClose={closeModal} className="contact-list-modal">
          <div className="modal p-3">
            <div className="flex flex-row justify-between">
              <h2 className="font-bold text-primary my-3">Select Contacts</h2>
              <IoIosCloseCircleOutline
                size="25"
                className="text-primary-light ml-1"
                cursor="pointer"
                onClick={closeModal}
              />
            </div>
            <SearchField
              defaultValue=""
              onSearch={(value: string) => {
                handleInputChange(value);
              }}
            />
            {optionList.length === 0 && <NoDataFound type="h6" testId="no-data" />}
            <div className="overflow-y-scroll max-vh-50">{lists}</div>
            <div className="flex justify-around">
              <Button classes={['w-full']} onClick={() => closeModal()}>
                Continue
              </Button>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}
