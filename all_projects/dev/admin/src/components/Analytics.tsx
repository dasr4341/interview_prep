/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { client } from 'apiClient';
import { PageViewLog, PageViewLogVariables } from 'generatedTypes';
import { LogAnalyticsData } from 'interface/LogAnalyticsData.interface';
import { pageViewLog } from 'lib/query/analytics/log-page-view';
import { getEnvironment } from 'lib/sentry.init';
import { RootState } from 'lib/store/app-store';
import _ from 'lodash';
import mixpanel, { Dict } from 'mixpanel-browser';
import posthog from 'posthog-js';
import Bowser from 'bowser';

const mixPanelToken = process.env.MIX_PANEL_TOKEN ? process.env.MIX_PANEL_TOKEN : '75b74962abbf7c30ef31e6b3f7e67782';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

export default function Analytics() {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const debounce = _.debounce(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    TrackingApi.track(AnalyticsEvents.PageChange, { customerId: user.currentUser.customerId });
  }, 800);

  useEffect(() => {
    if (user?.currentUser?.id && mixpanel && location) {
      debounce();
    }
  }, [location, user?.currentUser?.id]);

  useEffect(() => {
    mixpanel.init(mixPanelToken, { ignore_dnt: true });
    posthog.init('phc_lq4HfY1ZLPXrYosEihNlkX9jzmWPE3SgU5ZZxQ4G4t1', {
      api_host: 'https://app.posthog.com',
      autocapture: false,
    });
  }, []);

  return <></>;
}

export const TrackingApi = {
  identify: (uid: string, customerId: number) => {
    mixpanel.identify(uid);
    mixpanel.people.set({ env: getEnvironment(), customerId });

    posthog.identify(
      uid, // distinct_id, required
      { customerId } // $set_once, optional
    );
  },
  reset: () => {
    mixpanel.reset();
  },
  track: (event: AnalyticsEvents, data: Dict = {}) => {
    mixpanel.track(event, { ...data, env: getEnvironment() });
    posthog.capture(event, { ...data, env: getEnvironment() });
  },
  log: async (data: LogAnalyticsData) => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    await client.mutate<PageViewLog, PageViewLogVariables>({
      mutation: pageViewLog,
      variables: {
        fields: data ? { ...data, browser } : {},
      },
    });
  },
};

export enum AnalyticsEvents {
  'SessionStart' = 'Pretaa Session Start',
  'SessionEnd' = 'Pretaa Session End',
  'PageChange' = 'Page Change',
}
