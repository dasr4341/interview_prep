/* eslint-disable max-len */
import React, { useContext } from 'react';
import './_health-report.scoped.scss';

import biometricImg from '../../../../../src/assets/images/biometric-scale.svg';
import { biometricPointerColor, biometricPointerMiddle, biometricScalePointer } from 'Helper/biometric-scale-helper';
import { SimpleDailyReportContext } from '../EventDetailAccordion';

export default function BiometricScalePart() {
  const dailyReportData = useContext(SimpleDailyReportContext);
  return (
    <React.Fragment>
      <div className="inline-block relative biometric-area">
        <div className="absolute bio-content translate-y-[-50%] translate-x-[-50%] mt-4">
          <img src={biometricImg} alt="Biometric Scale" className="mx-auto my-0 text-center biometric-scale" />
          <span className="capitalize text-black font-bold text-sm whitespace-nowrap mt-2 block">Biometrics Scale</span>
        </div>
        <svg width="300" height="158" viewBox="0 0 300 158" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M34.777 98.7347C37.4218 99.6868 38.794 102.603 37.8418 105.248C33.1204 118.362 30.7061 132.195 30.7061 146.133C30.7061 148.944 28.4274 151.223 25.6164 151.223C22.8054 151.223 20.5267 148.944 20.5267 146.133C20.5267 131.019 23.1445 116.02 28.2641 101.799C29.2163 99.1546 32.1322 97.7825 34.777 98.7347Z" fill="#EA3F2A"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M68.3139 51.5573C70.253 53.5923 70.1753 56.814 68.1403 58.7531C58.0498 68.3685 49.701 79.659 43.464 92.1239C42.2062 94.6378 39.1487 95.656 36.6348 94.3982C34.121 93.1404 33.1027 90.0828 34.3606 87.569C41.1235 74.0527 50.1764 61.81 61.118 51.3837C63.153 49.4446 66.3747 49.5223 68.3139 51.5573Z" fill="#ED6513"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M119.627 24.3179C120.446 27.0069 118.93 29.8507 116.241 30.6696C102.908 34.7303 90.3781 41.0699 79.2083 49.4071C76.9557 51.0885 73.7665 50.6254 72.0851 48.3728C70.4037 46.1201 70.8668 42.9309 73.1194 41.2495C85.2313 32.2091 98.8175 25.3349 113.276 20.9317C115.965 20.1128 118.808 21.6288 119.627 24.3179Z" fill="#F3DD4A"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M172.125 27.2255C158.394 24.8328 144.352 24.8366 130.621 27.2367C127.853 27.7207 125.215 25.8684 124.731 23.0994C124.247 20.3304 126.1 17.6933 128.869 17.2093C143.757 14.6068 158.983 14.6027 173.872 17.1972C176.642 17.6797 178.495 20.3158 178.013 23.085C177.53 25.8543 174.894 27.708 172.125 27.2255Z" fill="#60DB89"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M183.183 24.3177C184.001 21.6287 186.845 20.1126 189.534 20.9316C203.992 25.3347 217.579 32.2088 229.691 41.2491C231.943 42.9305 232.406 46.1197 230.725 48.3723C229.044 50.625 225.854 51.0881 223.602 49.4067C212.432 41.0695 199.902 34.7301 186.569 30.6694C183.88 29.8505 182.364 27.0067 183.183 24.3177Z" fill="#29BF5C"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M234.744 51.7748C236.688 49.7449 239.91 49.6756 241.94 51.6201C252.854 62.075 261.875 74.3413 268.603 87.8752C269.854 90.3923 268.828 93.4472 266.311 94.6985C263.794 95.9497 260.739 94.9235 259.487 92.4064C253.283 79.9251 244.964 68.6128 234.898 58.9711C232.869 57.0266 232.799 53.8047 234.744 51.7748Z" fill="#29BF5C"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M268.363 99.5537C271.014 98.6201 273.921 100.013 274.854 102.664C279.874 116.92 282.387 131.937 282.281 147.051C282.261 149.862 279.966 152.124 277.155 152.105C274.344 152.085 272.082 149.79 272.101 146.979C272.199 133.041 269.882 119.192 265.253 106.045C264.319 103.394 265.712 100.487 268.363 99.5537Z" fill="#13923E"/>
          <path d={biometricPointerMiddle(dailyReportData?.simpleReportData?.score)} fill="white"/>
          <path fillRule="evenodd" clipRule="evenodd" d={biometricScalePointer(dailyReportData?.simpleReportData?.score)} fill={biometricPointerColor(dailyReportData?.simpleReportData?.score)}/>
        </svg>
      </div>
    </React.Fragment>
  );
}
