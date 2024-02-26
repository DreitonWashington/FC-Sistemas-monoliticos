import express, {Request, Response} from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import Address from "../../../modules/@shared/domain/value-object/address.value-object";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  try {
    const input = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: new Address({
        street: req.body.address.street,
        number: req.body.address.number,
        complement: req.body.address.complement,
        city: req.body.address.city,
        state: req.body.address.state,
        zipCode: req.body.address.zipCode,
      }),
    };

    const facade = ClientAdmFacadeFactory.create();
    const output = await facade.add(input);
    res.send(output);
  }catch(e) {
    res.status(500).send(e);
  }
});

clientRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const facade = ClientAdmFacadeFactory.create();
    const output = await facade.find({id: req.params.id});
    res.send(output);
  }catch(e){
    res.status(500).send(e);
  }
})