function Typescript() {
    // --------------- generics in function  ---------------
    function getFirstElement<T>(arr: T[]) {
        return arr[0];
    }
    const stringArr = ['SAM', 'Rahul', 'Orange']
    const numberArr = [1, 2, 3, 4]

    const r1 = getFirstElement<string>(stringArr); 
    const r2 = getFirstElement<number>(numberArr);

    console.log({ r1, r2 });

    // --------------- generics in object  ---------------
    // this is the normal one
    // type ApiResponse<T> = {
    //     data: T,
    //     isError: boolean
    // }

    // we can extend the type to mention that - the type will always be an OBJECT
    // we can also give default types - { user: [] }
    type ApiResponse<T extends object = { user: [] }> = {
            data: T,
            isError: boolean
        }

    const response: ApiResponse<{ user: string[], isLoggedIn: boolean }> = {
        data: {
            user: [],
            isLoggedIn: false
        },
        isError: false
    }

    console.log({ response });
    //  --------------- --------------- ---------------
    //  --------------- we can EXTENT  ---------------
    // interface IData {
    //     user: [],
    //     isLoggedIn: false
    // }
    // interface IError {
    //     isError: boolean
    // }
    // interface IResponse extends IError {
    //    data: IData
    // }
    

    // const response1:IResponse  = {
    //     data: {
    //         user: [],
    //         isLoggedIn: false
    //     },
    //     isError: false
    // }
    // console.log({ response1 });
    
    // type TData = {
    //     user: [],
    //     isLoggedIn: false
    // }
    // type TError =  {
    //     isError: boolean
    // }
    // type TResponse = { data: TData } & TError;
    
    // const response2: TResponse = {
    //     data: {
    //         user: [],
    //         isLoggedIn: false
    //     },
    //     isError: false
    // }

    // ----------------- UNION types ------------
    // type TData = string | string[];
    // this union an interface cannot do

    // -----------------------
    // type TAddress = [number, string]
   
    // console.log({ address });

    // interface IAddress extends Array<string | number>{
    //     1: string,
    //     0: number
    // }
    //  const address: IAddress = [104, 'Mankundu']

    // type X = Omit<TData, string>

    // 
    
    
    

   
  return (
    <div>Typescript</div>
  )
}

export default Typescript