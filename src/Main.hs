{-# LANGUAGE NoMonomorphismRestriction, OverloadedStrings #-}
{-# OPTIONS_GHC -Wall #-}
module Main where

import           Control.Concurrent
import           Control.Monad
import           Control.Monad.Random
import qualified GHCJS.Foreign        as G
import qualified GHCJS.Types          as G
import qualified JavaScript.Canvas    as C
import qualified JavaScript.JQuery    as J

import           Prelude              hiding (product, sum)

size :: Num a => a
size = 256

type Color = (Int, Int, Int)

-- | Compute the weighted average of two colors.
--   With w = 0.5 we get the average.
average :: Color -> Color -> Float -> Color
average (r1, g1, b1) (r2, g2, b2) w =
    let r3 = w * fromIntegral r1 + (1 - w) * fromIntegral r2
        g3 = w * fromIntegral g1 + (1 - w) * fromIntegral g2
        b3 = w * fromIntegral b1 + (1 - w) * fromIntegral b2
    in (floor r3, floor g3, floor b3)

-- | A function which looks a bit like a well.
well :: Double -> Double
well x = 1 - 2 / (1 + x * x) ** 8

-- | A function that looks a bit like a tent.
tent :: Double -> Double
tent x = 1 - 2 * abs x

-- | Draw a filled rectangle to the given canvas.
rect :: Color -> Int -> Int -> Int -> Int -> C.Context -> IO ()
rect (r, g, b) x y w h ctx = do
    C.fillStyle r g b 1 ctx
    C.fillRect (fromIntegral x) (fromIntegral y) (fromIntegral w) (fromIntegral h) ctx

--
-- Expression tree nodes
--

type Op = Double -> Double -> Color

data Constructor g m = Constructor
  { arity       :: Int
  , constructor :: [Op] -> RandT g m Op
  }

c :: Double -> Int
c d = round $ (d + 1) * 255 / 2

cr :: Int -> Double
cr i = (fromIntegral i * 2 / 255) - 1

variableX :: (Monad m, RandomGen g) => Constructor g m
variableX = Constructor 0 $ \[] -> return $ \x _ -> (c x, c x, c x)

variableY :: (Monad m, RandomGen g) => Constructor g m
variableY = Constructor 0 $ \[] -> return $ \_ y -> (c y, c y, c y)

constant :: (Monad m, RandomGen g) => Constructor g m
constant = Constructor 0 $ \[] -> do
  r <- getRandomR (0, 255)
  g <- getRandomR (0, 255)
  b <- getRandomR (0, 255)
  return (\_ _ -> (r, g, b))

sum :: (Monad m, RandomGen g) => Constructor g m
sum = Constructor 2 $ \[e1, e2] -> return $ \x y -> average (e1 x y) (e2 x y) 0.5

wellC :: (Monad m, RandomGen g) => Constructor g m
wellC = Constructor 1 $ \[e] -> return $ \x y ->
  let (r, g, b) = e x y
  in (c . well . cr $ r, c . well . cr $ g, c . well . cr $ b)

constructors :: (Monad m, RandomGen g) => [Constructor g m]
constructors = [variableX, variableY, constant, sum, wellC]

getFirst :: (a -> Bool) -> [a] -> (a, [a])
getFirst p (h : t)
  | p h       = (h, t)
  | otherwise = getFirst p t

draw
  :: Int        -- ^ current row
  -> Int        -- ^ square size
  -> Op         -- ^ pixel color generator
  -> C.Context  -- ^ canvas
  -> IO ()
draw y sqSize op ctx
  | sqSize < 1 = return ()
  | y >= size  = draw 0 (sqSize `div` 4) op ctx
  | otherwise  = do
      let m = size `mod` sqSize
          range = if m == 0 then size - sqSize else size
      forM_ [0, 0 + sqSize .. range] $ \x ->
        let x' = 2.0 * (fromIntegral x + fromIntegral sqSize / 2) / size - 1.0
            y' = 2.0 * (fromIntegral y + fromIntegral sqSize / 2) / size - 1.0
        in rect (op x' y') x y sqSize sqSize ctx
      threadDelay 1000000
      draw (y + sqSize) sqSize op ctx

-- | Return a randomly-selected choices in give list.
getRandomCs :: (Monad m, RandomGen g) => [a] -> RandT g m a
getRandomCs [] = error "empty list given to getRandomCs"
getRandomCs l  =
    -- yet another type with monad instance but not applicative instance
    liftM ((!!) l) $ getRandomR (0, length l - 1)

-- | Find a constructor with at most give arity.
findConstructor
  :: (Monad m, RandomGen g) => (Constructor g m -> Bool) -> RandT g m (Constructor g m)
findConstructor p = getRandomCs $ filter p constructors

generate :: (Monad m, RandomGen g) => Int -> RandT g m Op
generate expSize
  | expSize == 0 = error "can't generate exp with size 0"
  | expSize == 1 = do
      c <- findConstructor ((0 ==) . arity)
      constructor c []
  | otherwise = do
      c <- findConstructor ((\a -> a /= 0 && a < expSize) . arity)
      let ar = arity c
          subexpSize = floor $ fromIntegral (expSize - 1) / fromIntegral ar
          lastSize = subexpSize + ((expSize - 1) `mod` ar)
      subexps <-
        if lastSize == 0
          then replicateM ar (generate subexpSize)
          else liftM2 (:)
                      (generate lastSize)
                      (replicateM (ar - 1) (generate subexpSize))
      constructor c subexps

main :: IO ()
main = do
    ctx <- C.getContext =<< G.indexArray 0 . G.castRef =<< J.select "#theCanvas"
    randGen <- getStdGen
    op <- evalRandT (generate 50) randGen
    draw 0 64 op ctx
    putStrLn "done"

