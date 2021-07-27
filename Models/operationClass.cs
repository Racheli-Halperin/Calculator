namespace ReactDemo.Models
{
    public abstract class Operation
    {
        public decimal NumberA { get; set; }
        public decimal NumberB { get; set; }

        public abstract decimal GetResult();

    }

    public class Mult : Operation
    {
        public override decimal GetResult()
        {
            return NumberA * NumberB;
        }
    }
    public class Div : Operation
    {
        public override decimal GetResult()
        {
            if (NumberB != 0)
                return NumberA / NumberB;
            return 0;
        }
    }
    public class Add : Operation
    {
        public override decimal GetResult()
        {
            return NumberA + NumberB;
        }
    }
    public class Diff : Operation
    {
        public override decimal GetResult()
        {
            return NumberA - NumberB;
        }
    }
    public static class OperationFactory
    {
        public static Operation CreateOperate(string operatestring)
        {
            Operation oper = null;
            switch (operatestring)
            {
                //Add on the original basis
                case "Add":
                    oper = new Add();
                    break;
                case "Mul":
                    oper = new Mult();
                    break;
                case "Diff":
                    oper = new Diff();
                    break;
                case "Div":
                    oper = new Div();
                    break;


            }
            return oper;

        }
    }
}