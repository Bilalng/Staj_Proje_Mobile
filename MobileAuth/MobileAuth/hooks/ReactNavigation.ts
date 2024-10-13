import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends ParamListBase {
      // Parametreleri burada tanımlayabilirsiniz, örneğin:
      Home: undefined;
      Profile: { userId: string };
    }
  }
}

// Doğru generic tip tanımlaması:
export function useReactNavigation<
  T extends NavigationProp<ReactNavigation.RootParamList>
>(): T {
    const navigation = useNavigation<T>();
    return navigation;
}
