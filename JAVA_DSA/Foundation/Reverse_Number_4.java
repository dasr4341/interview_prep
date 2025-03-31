package Foundation;

import java.util.Scanner;

public class Reverse_Number_4 {

    public static void SolveProblem(int n) {
        int newNumber = 1;
        // 123
        // 321
        while (n != 0) {
            int r = n % 10;
            newNumber = newNumber == 1 ? r : newNumber * 10 + r;

            System.out.println(r + " " + newNumber);
            n = n / 10;
        }
    }

    public static void main(String args[]) throws Exception {
        Scanner scn = new Scanner(System.in);
        int n = scn.nextInt();
        SolveProblem(n);
    }
}
