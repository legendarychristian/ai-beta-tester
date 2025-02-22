import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';

type MouthType = 'smile' | 'surprised' | 'laughing' | 'nervous' | 'sad' | 'pucker' | 'frown' | 'smirk';
type HairType = 'fonze' | 'mrT' | 'dougFunny' | 'mrClean' | 'dannyPhantom' | 'full' | 'turban' | 'pixie';
type EyebrowType = 'up' | 'down' | 'eyelashesUp' | 'eyelashesDown';
type EyesType = 'eyes' | 'round' | 'eyesShadow' | 'smiling' | 'smilingShadow';
type EarsType = 'attached' | 'detached';
type NoseType = 'curve' | 'pointed' | 'tound';
type ShirtType = 'open' | 'crew' | 'collared';
type FacialHairType = 'beard' | 'scruff';
type GlassesType = 'round' | 'square';

export interface AvatarConfig {
  seed: string;
  baseColor: string[];
  hair: HairType[];
  hairColor: string[];
  eyes: EyesType[];
  eyebrows: EyebrowType[];
  mouth: MouthType[];
  nose: NoseType[];
  ears: EarsType[];
  shirt: ShirtType[];
  shirtColor: string[];
  facialHair?: FacialHairType[];
  glasses?: GlassesType[];
  facialHairProbability: number;
  glassesProbability: number;
  earringsProbability: number;
}

export const avatarConfigs: Record<string, AvatarConfig> = {
  whiteFemale: {
    seed: 'white-female',
    baseColor: ['f9c9b6'],
    hair: ['pixie'],
    hairColor: ['77311d'],
    eyes: ['round'],
    eyebrows: ['up'],
    mouth: ['smile'],
    nose: ['pointed'],
    ears: ['attached'],
    shirt: ['collared'],
    shirtColor: ['ffffff'],
    facialHairProbability: 0,
    glassesProbability: 0,
    earringsProbability: 50
  },

  whiteMale: {
    seed: 'white-male',
    baseColor: ['f9c9b6'],
    hair: ['mrClean'],
    hairColor: ['77311d'],
    eyes: ['round'],
    eyebrows: ['up'],
    mouth: ['smile'],
    nose: ['pointed'],
    ears: ['attached'],
    shirt: ['collared'],
    shirtColor: ['ffffff'],
    facialHair: ['scruff'],
    facialHairProbability: 30,
    glassesProbability: 0,
    earringsProbability: 0
  },

  blackMale: {
    seed: 'black-male',
    baseColor: ['77311d'],
    hair: ['mrClean'],
    hairColor: ['000000'],
    eyes: ['round'],
    eyebrows: ['up'],
    mouth: ['smile'],
    nose: ['pointed'],
    ears: ['attached'],
    shirt: ['collared'],
    shirtColor: ['ffffff'],
    facialHair: ['scruff'],
    facialHairProbability: 30,
    glassesProbability: 0,
    earringsProbability: 0
  },

  blackFemale: {
    seed: 'black-female',
    baseColor: ['77311d'],
    hair: ['full'],
    hairColor: ['000000'],
    eyes: ['round'],
    eyebrows: ['up'],
    mouth: ['smile'],
    nose: ['pointed'],
    ears: ['attached'],
    shirt: ['collared'],
    shirtColor: ['d3d3d3'],
    facialHairProbability: 0,
    glassesProbability: 0,
    earringsProbability: 50
  },

  asianFemale: {
    seed: 'asian-female',
    baseColor: ['f9c9b6'],
    hair: ['pixie'],
    hairColor: ['000000'],
    eyes: ['round'],
    eyebrows: ['up'],
    mouth: ['smile'],
    nose: ['pointed'],
    ears: ['attached'],
    shirt: ['collared'],
    shirtColor: ['ffffff'],
    facialHairProbability: 0,
    glassesProbability: 0,
    earringsProbability: 50
  },

  asianMale: {
    seed: 'asian-male',
    baseColor: ['f9c9b6'],
    hair: ['mrClean'],
    hairColor: ['000000'],
    eyes: ['round'],
    eyebrows: ['up'],
    mouth: ['smile'],
    nose: ['pointed'],
    ears: ['attached'],
    shirt: ['collared'],
    shirtColor: ['ffffff'],
    facialHair: ['scruff'],
    facialHairProbability: 20,
    glassesProbability: 0,
    earringsProbability: 0
  },

  multiracialMale: {
    seed: 'multiracial-male',
    baseColor: ['ac6651'],
    hair: ['full'],
    hairColor: ['000000'],
    eyes: ['round'],
    eyebrows: ['up'],
    mouth: ['smile'],
    nose: ['pointed'],
    ears: ['attached'],
    shirt: ['collared'],
    shirtColor: ['ffffff'],
    facialHair: ['scruff'],
    facialHairProbability: 30,
    glassesProbability: 0,
    earringsProbability: 0
  },

  multiracialFemale: {
    seed: 'multiracial-female',
    baseColor: ['ac6651'],
    hair: ['full'],
    hairColor: ['000000'],
    eyes: ['round'],
    eyebrows: ['up'],
    mouth: ['smile'],
    nose: ['pointed'],
    ears: ['attached'],
    shirt: ['collared'],
    shirtColor: ['ffffff'],
    facialHairProbability: 0,
    glassesProbability: 0,
    earringsProbability: 50
  },

  pacificIslanderFemale: {
    seed: 'pacific-islander-female',
    baseColor: ['ac6651'],
    hair: ['full'],
    hairColor: ['000000'],
    eyes: ['round'],
    eyebrows: ['up'],
    mouth: ['smile'],
    nose: ['pointed'],
    ears: ['attached'],
    shirt: ['collared'],
    shirtColor: ['ffffff'],
    facialHairProbability: 0,
    glassesProbability: 0,
    earringsProbability: 50
  },

  pacificIslanderMale: {
    seed: 'pacific-islander-male',
    baseColor: ['ac6651'],
    hair: ['fonze'],
    hairColor: ['000000'],
    eyes: ['round'],
    eyebrows: ['up'],
    mouth: ['smile'],
    nose: ['pointed'],
    ears: ['attached'],
    shirt: ['collared'],
    shirtColor: ['ffffff'],
    facialHair: ['scruff'],
    facialHairProbability: 30,
    glassesProbability: 0,
    earringsProbability: 0
  },

  alaskanNativeMale: {
    seed: 'alaskan-native-male',
    baseColor: ['f9c9b6'],
    hair: ['turban'],
    hairColor: ['000000'],
    eyes: ['round'],
    eyebrows: ['up'],
    mouth: ['smile'],
    nose: ['pointed'],
    ears: ['attached'],
    shirt: ['collared'],
    shirtColor: ['ffffff'],
    facialHair: ['scruff'],
    facialHairProbability: 30,
    glassesProbability: 0,
    earringsProbability: 0
  },

  alaskanNativeFemale: {
    seed: 'alaskan-native-female',
    baseColor: ['f9c9b6'],
    hair: ['pixie'],
    hairColor: ['000000'],
    eyes: ['round'],
    eyebrows: ['up'],
    mouth: ['smile'],
    nose: ['pointed'],
    ears: ['attached'],
    shirt: ['collared'],
    shirtColor: ['ffffff'],
    facialHairProbability: 0,
    glassesProbability: 0,
    earringsProbability: 50
  }
};


export const createAvatarFromConfig = (configName: keyof typeof avatarConfigs) => {
  const config = avatarConfigs[configName];
  return createAvatar(micah, {
    ...config,
    backgroundColor: ['transparent']
  });
};