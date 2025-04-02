import HappyFaceIcon from 'assets/images/happy_face.svg';
import UnHappyFaceIcon from 'assets/images/unhappy_face.svg';
import NeutralFaceIcon from 'assets/images/neutral_face.svg';

export const getRatingIcon = (rating: string) => {
  switch (rating) {
    case 'HAPPY':
      return HappyFaceIcon;
    case 'UNHAPPY':
      return UnHappyFaceIcon;
    case 'NEUTRAL':
      return NeutralFaceIcon;
    default:
      throw new Error(`Invalid rating type ${rating} passed.`);
  }
};
