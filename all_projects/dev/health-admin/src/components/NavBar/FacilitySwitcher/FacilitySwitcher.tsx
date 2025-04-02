import React, { useEffect, useState } from 'react';
import { getAppData, setAppData } from 'lib/set-app-data';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { UserTypeRole } from 'health-generatedTypes';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { SelectBox } from 'interface/SelectBox.interface';
import AppDropDown from 'components/themeDropDown/appDropdown/AppDropDown';

enum DropdownAllOption {
  ALL = 'all',
}

export default function FacilitySwitcher() {
  const dispatch = useAppDispatch();

  const pretaaAdmin = useAppSelector((state) => state.auth.pretaaAdmin);
  const facilityListState = useAppSelector((state) => state.auth.user?.pretaaHealthCurrentUser.userFacilities);

  const [switcherState, setSwitcherState] = useState<boolean>(true);
  const [facilityList, setFacilityList] = useState<SelectBox[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<SelectBox[]>([]);

  const onApply = (selectedFacilities: SelectBox[]) => {
    const appData = getAppData();

    const selectedList = selectedFacilities.length ? selectedFacilities : [facilityList[1]];

    const selectedFacilityId = selectedList.map((e) => e.value);
    setAppData({
      ...appData,
      selectedFacilityId:
        selectedList[0]?.label === DropdownAllOption.ALL ? selectedFacilityId.slice(1) : selectedFacilityId,
    });

    dispatch(appSliceActions.setAppLoading(true));

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const onChange = (
    data: SelectBox | null,
    eventType: 'badgeRemove' | 'dropDownEvent',
    isMenuOpen: boolean,
    allUnChecked?: boolean,
  ) => {
    if (allUnChecked) {
      setSelectedFacility([facilityList[1]]);
      if (eventType === 'badgeRemove') {
        onApply([facilityList[1]]);
      }
      return;
    }
    if (!data) {
      return;
    }
    const currentState = selectedFacility.filter((facility) => facility.value !== DropdownAllOption.ALL);
    const isSelected = currentState.find((state) => state.value === data.value);
    let result: SelectBox[] = [];

    if (data.value === DropdownAllOption.ALL) {
      result = !selectedFacility.find((state) => state.value === data.value) ? facilityList : [];
    } else if (!isSelected) {
      const list = [...currentState, data];
      result = list.length === facilityList.length - 1 ? facilityList : list;
    } else {
      result = currentState.filter((facility) => facility.value !== data.value);
    }
    setSelectedFacility(result);
    if (eventType === 'badgeRemove' && selectedFacility.length !== facilityList.length && !isMenuOpen) {
      onApply(result);
    }
  };

  useEffect(() => {
    const appData = getAppData();
    if (!pretaaAdmin && facilityListState?.length && Number(appData.selectedFacilityId?.length) > 0) {
      const nameHelper: { [key: string]: string } = {};
      const currentRoles = appData.selectedRole;
      const selectedFacilitiesIds: string[] = appData?.selectedFacilityId || [];

      if (currentRoles === UserTypeRole.PATIENT || currentRoles === UserTypeRole.SUPPORTER || pretaaAdmin) {
        setSwitcherState(false);
      }

      const allOption = [{ label: DropdownAllOption.ALL, value: DropdownAllOption.ALL }] as Array<SelectBox>;
      const facilityOption =
        facilityListState?.map((e) => {
          nameHelper[e.id] = e.name;
          return {
            label: e.name,
            value: e.id,
          };
        }) || [];

      setFacilityList(
        facilityListState && facilityListState.length > 1 ? allOption.concat(facilityOption) : facilityOption,
      );

      const formattedData =
        selectedFacilitiesIds
          .filter((id) => id)
          .map((id) => ({
            label: nameHelper[id],
            value: id,
          })) || [];

      setSelectedFacility(
        formattedData?.length === facilityListState?.length
          ? [
              ...formattedData,
              {
                label: DropdownAllOption.ALL,
                value: DropdownAllOption.ALL,
              },
            ]
          : formattedData,
      );
    }
  }, [facilityListState, pretaaAdmin]);

  return (
    <>
      {(switcherState && !pretaaAdmin) && (
        <div className="-ml-5 -mr-5  lg:-ml-6 lg:-mr-6 ">
          <p className=" mb-2 ml-1">Selected Facility</p>
            <AppDropDown
              showBadge={{
                badge: true,
                closeBtn: facilityList.length > 1 && selectedFacility.length > 1,
              }}
              dropDownClassName="max-h-24 md:max-h-28 lg:max-h-36 xl:max-h-44 text-xs"
              closeMenuOnSelect={false}
              onApply={onApply}
              value={selectedFacility}
              options={
                selectedFacility.find((f) => f.value === DropdownAllOption.ALL)?.value
                  ? facilityList.slice(0, 1)
                  : (facilityList as any)
              }
              onChange={onChange}
              disableMenu={facilityList.length === 1}
            />
        </div>
      )}
    </>
  );
}
