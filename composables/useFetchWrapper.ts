
export enum EFetchMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
}

export type fetchWrapperProps = {
  method: EFetchMethods,
  path: string,
  body?: any,
  headers?: any,
}

export const useFetchWrapper = async ({
  method,
  path,
  body,
  headers
}: fetchWrapperProps): Promise<any> => {
  const baseUrl = 'http://ec2-3-144-33-2.us-east-2.compute.amazonaws.com'; // hardcoded until server is deployed to grab it dynamically
  const url = `${baseUrl}/${path}`;
  const options = {
    method,
    body: body || null,
    headers: headers || {},
  };

  const response = await useFetch(url, options);
  return response;
};