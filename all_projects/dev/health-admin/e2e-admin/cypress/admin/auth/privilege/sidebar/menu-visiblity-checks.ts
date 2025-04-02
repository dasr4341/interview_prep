
export default class MenuLinksVisibility {
  locators = {
    menuLinks: '[data-testid="nav-menu-links"]',
    settingsLink: '[data-testid="settingsLink"]',
  };

  menuLinks = {
  supporter: {
    Events: '',
    Assessment: '',
    Settings: ['Preferences', 'Profile', 'Notes', 'Notifications'],
  },
  patient: {
    Events: '',
    Assessment: '',
    Settings: ['Preferences', 'Profile', 'Notes', 'Notifications'],
  },
  facilityUser: {
    Events: '',
    Patients: '',
    Assessments: '',
    Reporting: ['Events', 'Assessment Stats'],
    Settings: ['Preferences', 'Profile', 'Notes', 'Notifications'],
  },
  facilityAdmin: {
    Assessment: '',
    Reporting: ['Events'],
    Settings: [
      'Preferences',
      'Profile',
      'Geofences',
      'Total Last Locations',
      'Total Geofences',
      'Patient Management',
      'Staff Management',
    ],
  },
  superAdmin: {
    Settings: ['Preferences', 'Profile'],
    Admin: ['Facility Management'],
  },
  pretaaAdmin: {
    'Pretaa Admin': ['Client Management', 'Standard Template'],
  },
};

}
