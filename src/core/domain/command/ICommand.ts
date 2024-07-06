export default interface ICommand 
{
    invoke: (args: {[key: string]: unknown}) => Promise<void>|void;
}