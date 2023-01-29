import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppError } from '@utils/appError';
import { groupsGettAll } from './groupsGetAll';
import {GROUP_COLLECTION} from '../storageGroup'
export async function groupCreate(newGroup: string) {
    try{
        const storageGroups = await groupsGettAll();

        const groupAlreadyExists = storageGroups.includes(newGroup);

        if (groupAlreadyExists) {
            throw new AppError('Já existe um grupo cadastrado com esse nome');
        }

        const storage = JSON.stringify([...storageGroups, newGroup])
        await AsyncStorage.setItem(GROUP_COLLECTION, storage);
    }catch(error) {
        throw error;
    }

}

