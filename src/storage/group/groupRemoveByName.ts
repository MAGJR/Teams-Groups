import AsyncStorage from "@react-native-async-storage/async-storage";

import { GROUP_COLLECTION, PLAYER_COLLECTION } from "@storage/storageGroup";

import {groupsGettAll} from './groupsGetAll';

export async function groupRemoveByName (groupDeleted: string) {
    try {
        const storageGroups = await groupsGettAll();
        const groups = storageGroups.filter(group => group !== groupDeleted);

        await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groups));
        await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupDeleted}`)

    } catch (error) {
        throw error;
    }
}