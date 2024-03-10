import express, {Request, Response} from "express";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
  try{
    const invoiceFacade = InvoiceFacadeFactory.create();
    const output = await invoiceFacade.find({id: req.params.id})
    res.send(output)
  }catch(e){
    res.status(500).send(e);
  }
})